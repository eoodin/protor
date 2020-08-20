package online.eoodin.protor.dao;

import online.eoodin.protor.entity.User;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;

public interface UserDAO extends JpaRepositoryImplementation<User, Long> {
    User findByUsername(String username);
}
