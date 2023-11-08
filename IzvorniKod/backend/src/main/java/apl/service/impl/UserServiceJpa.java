package apl.service.impl;

import apl.dao.*;
import apl.domain.*;
import apl.email.EmailSender;
import apl.email.EmailValidator;
import apl.token.ConfirmationToken;
import apl.token.ConfirmationTokenService;
import apl.service.RequestDeniedException;
import apl.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

//ovdje se pišu sve funkcije koje nam trebaju


@Service
public class UserServiceJpa implements UserService {
    //Dependency injection
    //@Autowired
    private EmailValidator emailValidator;
    @Autowired  //kažemo mu da nam automatski "pospaja" sve reference i objekte koje smo mi stvorili
    private UserRepository userRepo;    //varijabla objekta
    @Autowired
    private ManagerRepository managerRepo;
    @Autowired
    private ResearcherRepository researcherRepo;
    @Autowired
    private StationRepository stationRepo;
    @Autowired
    private TrackerRepository trackerRepo;

    //private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private ConfirmationTokenService confirmationTokenService;

    @Autowired
    private EmailSender emailSender;

    //@Autowired
    //private UserServiceJpa userService;


    @Override
    public List<User> listAll() {
        return userRepo.findAll();      //findAll nadljeduje iz JpaRepository
    }

    public int enableUser(String email) {
        return userRepo.enableUser(email);
    }
    @Override
    public ResponseEntity<String> createUser(User user) {
        //boolean isValidEmail = emailValidator.
          //      test(user.getEmail());


        //if (!isValidEmail) {
          //  throw new IllegalStateException("email not valid");
        //}
        Assert.notNull(user, "User object must be given");  //moramo dobit objekt, ne možemo u bazu stavit null
        Assert.isNull(user.getId(), "Student ID must be null, not " + user.getId());    //zato što ga mi settiramo autom s generated value

        if (userRepo.countByEmail(user.getEmail()) > 0){
            throw new RequestDeniedException("User with email " + user.getEmail() + "already exists!");
        }
        if (userRepo.countByUsername(user.getUsername()) > 0){
            throw new RequestDeniedException("User with username " + user.getUsername() + "already exists!");
        }
        if (userRepo.countByEmail(user.getEmail()) > 0 && userRepo.countByUsername(user.getUsername()) > 0){
            throw new RequestDeniedException("User with email " + user.getEmail() + " and username " + user.getUsername() + "already exists!");
        }

        //String encodedPswd = bCryptPasswordEncoder.encode(user.getPassword());
        //user.setPassword(encodedPswd);      //kodiranje lozinke

        userRepo.save(user);

        if(user.getRole() == 1){
            researcherRepo.save(new Researcher(user.getId()));
        } else if(user.getRole() == 2){
            managerRepo.save(new Manager(user.getId(), 0L));
        } else {
            trackerRepo.save(new Tracker(user.getId(), 0L));
        }


        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(token,
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(20),
                user);

        confirmationTokenService.saveConfirmationToken(confirmationToken);

        String link = "http://localhost:8000/auth/confirm?token=" + token;
        emailSender.send(user.getEmail(), buildEmail(user.getName(), link));

        return ResponseEntity.ok("Data received and processed");
    }

    @Override
    public ResponseEntity<String> logInUser(LogInDTO loginuser) {
        User user = new User();
        user.setUsername(loginuser.getUsername());
        user.setPassword(loginuser.getPassword());
        user.setEmail(loginuser.getEmail());
        if (userRepo.countByEmail(user.getEmail()) == 0){
            throw new RequestDeniedException("User with email " + user.getEmail() + "doesn't exist!");
        }
        if (userRepo.countByUsername(user.getUsername()) == 0){
            throw new RequestDeniedException("User with username " + user.getUsername() + "doesn't exist!");
        }
        if (userRepo.countByEmail(user.getEmail()) == 0 && userRepo.countByUsername(user.getUsername()) == 0){
            throw new RequestDeniedException("User with email " + user.getEmail() + " and username " + user.getUsername() + "doesn't exist!");
        }
        if (user.isRegistered()) {
            return ResponseEntity.ok("Data received and processed");
        }
        else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please register first!");
        }
    }

    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElseThrow(() ->
                        new IllegalStateException("token not found"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("email already confirmed");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("token expired");
        }

        confirmationTokenService.setConfirmedAt(token);


        enableUser(confirmationToken.getUser().getEmail());

        return "confirmed";
    }


    private String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 20 minutes. <p>See you soon</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }

}
