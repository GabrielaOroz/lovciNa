package apl.service.impl;

import apl.dao.*;
import apl.domain.*;
import apl.email.EmailSender;
import apl.token.ConfirmationToken;
import apl.token.ConfirmationTokenRepository;
import apl.token.ConfirmationTokenService;
import apl.service.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.validation.annotation.Validated;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

//ovdje se pišu sve funkcije koje nam trebaju


@Service
public class UserServiceJpa implements UserService {

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

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;


    PasswordEncoder passwordEncoder;

    @Autowired
    private ConfirmationTokenService confirmationTokenService;

    @Autowired
    private EmailSender emailSender;


    private void validatePassword(String password) {
        if (!password.matches("^(?=.*[0-9])(?=.*[!@#$%^&*])[\\w!@#$%^&*]{8,16}$")) {
            throw new IllegalStateException("Invalid password format");
        }
    }

    public UserServiceJpa(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    private Manager saveManager( Manager manager) {
        validatePassword(manager.getPassword());
        manager.setPassword(this.passwordEncoder.encode(manager.getPassword()));
        return this.managerRepo.save(manager);
    }
    @Transactional
    private Researcher saveResearcher( Researcher researcher) {
        validatePassword(researcher.getPassword());
        researcher.setPassword(this.passwordEncoder.encode(researcher.getPassword()));
        return this.researcherRepo.save(researcher);
    }
    @Transactional
    private Tracker saveTracker( Tracker tracker) {
        validatePassword(tracker.getPassword());
        tracker.setPassword(this.passwordEncoder.encode(tracker.getPassword()));
        return this.trackerRepo.save(tracker);
    }
    @Transactional
    private User saveUser( User user ) {
        validatePassword(user.getPassword());
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        return this.userRepo.save(user);
    }

    @Override
    public List<RegisteredDTO> listAllRegistered() {
        List<User> lista = userRepo.listAllRegistered();
        List<RegisteredDTO> listaDTO = new ArrayList<>();

        for(User user : lista){
            RegisteredDTO regUser = new RegisteredDTO();

            regUser.setName(user.getName());
            regUser.setSurname(user.getSurname());
            regUser.setEmail(user.getEmail());
            regUser.setUsername(user.getUsername());
            regUser.setPassword(user.getPassword());
            regUser.setPhoto(user.getPhoto());
            regUser.setRole(user.getRole());
            regUser.setId(user.getId());

            listaDTO.add(regUser);
        }

        for (RegisteredDTO user : listaDTO) {

            if (user.getRole().equals("manager")){
                Optional<Manager> manager = managerRepo.findById(user.getId());
                if(manager.isPresent()){
                    if(!manager.get().isApproved()){
                        user.setApproved(false);
                    }
                }
            }
            else if (user.getRole().equals("researcher")){
                Optional<Researcher> researcher = researcherRepo.findById(user.getId());
                if(researcher.isPresent()){
                    if(!researcher.get().isApproved()){
                        user.setApproved(false);
                    }
                }
            }
        }

        return listaDTO;
    }

    public int enableUser(String email) {
        return userRepo.enableUser(email);
    }

    @Override
    public List<User> listAll() {
        return null;
    }

    @Override
    public int createUser(User user, Long stationId) {

        boolean success=false;

        Assert.notNull(user, "User object must be given");  //moramo dobit objekt, ne možemo u bazu stavit null
        Assert.isNull(user.getId(), "Student ID must be null, not " + user.getId());    //zato što ga mi settiramo autom s generated value


        if (userRepo.countByEmail(user.getEmail()) > 0 && userRepo.countByUsername(user.getUsername()) > 0){
            return 1;
        }
        if (userRepo.countByEmail(user.getEmail()) > 0){
            return 2;
        }
        if (userRepo.countByUsername(user.getUsername()) > 0){
            return 3;
        }


        if(user.getRole().equals("researcher") && stationId == null){
            try {
                user = saveResearcher(new Researcher(user));
                success = true;
            } catch (Exception e) {return -1;}

        } else if (stationId != null) {
            if (user.getRole().equals("manager")) {
                try {
                    user = saveManager(new Manager(user,stationId));
                    success = true;
                } catch (Exception e) {return -1;}

            } else if (user.getRole().equals("tracker")) {
                try {
                    user = saveTracker(new Tracker(user, stationId));
                    success = true;
                } catch (Exception e) {
                    return -1;
                }
            } else return -1;

        } else return -1;


        if (success == true) {
            String token = UUID.randomUUID().toString();
            ConfirmationToken confirmationToken = new ConfirmationToken(token,
                    LocalDateTime.now(),
                    LocalDateTime.now().plusMinutes(20),
                    user);

            confirmationTokenService.saveConfirmationToken(confirmationToken);
            String link = "http://localhost:8000/auth/confirm?token=" + token;
            emailSender.send(user.getEmail(), buildEmail(user.getName(), link));

            return 0;
        } else return -1;
    }

    @Override
    public int logInUser(LogInDTO loginuser) {
        User user = new User();

        user.setUsername(loginuser.getUsername());

        if (userRepo.countByUsername(user.getUsername()) == 0){
            return -1;
        }

        User user1=userRepo.findByUsername(user.getUsername()).orElse(null);

        if (!(user1.isRegistered())) {
            return -2;
        }

        String storedPassword = user1.getPassword();
        if(!(passwordEncoder.matches(loginuser.getPassword(),storedPassword))) {
            return -3;
        }
        return 0;
    }

    @Override
    public int logInAdmin(String pass) {
        if (pass.equals("admin")) {
            return 0;
        }
        return -1;
    }

    @Override
    public int updateUser(User userD) {
        Optional<User> userOptional = userRepo.findById(userD.getId());

        if (userOptional.isPresent()) {

            User user = userOptional.get();
            if(userD.getPhoto() != null) {
                user.setPhoto(userD.getPhoto());
            }
            user.setName(userD.getName());
            user.setSurname(userD.getSurname());
            user.setEmail(userD.getEmail());
            user.setUsername(userD.getUsername());

            if (!userD.getPassword().isEmpty()) {
                user.setPassword(userD.getPassword());

                try {
                    saveUser(user);
                    return 0;
                } catch (Exception e) {
                    return -1;
                }
            }
            try {
                userRepo.save(user);
                return 0;
            } catch (Exception e) {
                return -1;
            }
        }
        return -1;
    }
    @Override
    public int approveUser(ApprovedDTO approvedDTO) {
        Optional<User> userOptional = userRepo.findById(approvedDTO.getId());
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getRole().equals("manager")) {
                Optional<Manager> managerOptional = managerRepo.findById(user.getId());
                if(managerOptional.isPresent()){
                    Manager manager = managerOptional.get();
                    if (!manager.isApproved()) {
                        manager.setApproved(true);
                        managerRepo.save(manager);
                    }
                }
            }
            else if (user.getRole().equals("researcher")) {
                Optional<Researcher> researcherOptional = researcherRepo.findById(user.getId());
                if(researcherOptional.isPresent()){
                    Researcher researcher = researcherOptional.get();
                    if (!researcher.isApproved()) {
                        researcher.setApproved(true);
                        researcherRepo.save(researcher);
                    }
                }
            }
            return 0;
        }
        return -1;
    }

    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenService
                .getToken(token)
                .orElse(null);

        if (confirmationToken == null) {
            return "token_not_found";
        }

        if (confirmationToken.getConfirmedAt() != null) {
            return "email_already_confirmed";
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        confirmationTokenService.setConfirmedAt(token);

        if (expiredAt.isBefore(LocalDateTime.now())) {
            confirmationTokenRepository.deleteById(confirmationToken.getUser().getId());
            userRepo.deleteById(confirmationToken.getUser().getId());
            return "token_expired";
        }


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
