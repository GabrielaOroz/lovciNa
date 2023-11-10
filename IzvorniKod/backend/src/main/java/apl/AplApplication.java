package apl;

import apl.dao.TrackerRepository;
import apl.dao.UserRepository;
import apl.domain.Tracker;
import apl.domain.User;
import ch.qos.logback.core.net.SyslogOutputStream;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AplApplication {

	public static void main(String[] args) {
		SpringApplication.run(AplApplication.class, args);
	}


	/*@Bean
	public CommandLineRunner demo(UserRepository userRepository, TrackerRepository trackerRepository) {
		return args -> {
			// Your testing logic here
			/*User user = new User();
			user.setUsername("testUser");
			userRepository.save(user);

			// Fetch the user from the database
			User fetchedUser = userRepository.findById(user.getId()).orElse(null);
			if (fetchedUser != null) {
				System.out.println("Fetched user: " + fetchedUser.getUsername());
			} else {
				System.out.println("User not found");
			}*/
			/*byte[] byteArray = { 65, 66, 67, 68, 69 };
			User user=new User("Konj","tracker",byteArray,"pass","Zdravko","Dren","email@email");
			//userRepository.save(user);
			trackerRepository.save(new Tracker(user,0L));
			User tracker1=userRepository.findByUsername("Konj").orElse(null);
			if (tracker1!=null) {
				System.out.println(tracker1.getUsername());
				tracker1.setUsername("Hippo");
				userRepository.save(tracker1);
			}
			Tracker tracker2=trackerRepository.findByUsername("Hippo").orElse(null);
			if (tracker2!=null) System.out.println(tracker2.getUsername());
			User user1=new User("fjfhj","tracker",byteArray,"pass","Zdravko","Dren","email@femail");
			user1.setId(309L);
			userRepository.save(user1);
			System.out.println("CONTROL");
		};*/
	}

