package apl.token;

import apl.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ScheduledTaskService {

    @Autowired
    private UserRepository userRepository;

    private ConfirmationTokenRepository confirmationTokenRepository;

    public ScheduledTaskService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Run this task every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void deleteOldRecords() {
        // Define your condition for deletion, for example, records older than 30 days
        LocalDateTime thresholdDate = LocalDateTime.now().minusMinutes(1);

        // Delete records based on the condition
        confirmationTokenRepository.deleteByExpiresAt(thresholdDate);
    }
}
