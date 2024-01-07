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

	}

