package apl.token;

import apl.dao.UserRepository;
import apl.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ScheduledTaskService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    public ScheduledTaskService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //@Scheduled(cron = "0 50 22 * * *")      //svaki dan u ponoć
    public void deleteWithExpiredToken() {

        List<User> usersToDelete = userRepository.findByRegisteredFalse();

        for (User user : usersToDelete){
            ConfirmationToken confirmationToken = confirmationTokenRepository.getById(user.getId());

            if (confirmationToken.getExpiresAt().isAfter(LocalDateTime.now())){
                userRepository.deleteById(user.getId());
                confirmationTokenRepository.deleteById(user.getId());
            }
        }
    }
}
