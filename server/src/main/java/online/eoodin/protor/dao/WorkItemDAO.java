package online.eoodin.protor.dao;

import online.eoodin.protor.entity.Item;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;

public interface WorkItemDAO extends JpaRepositoryImplementation<Item, Long> {
}
