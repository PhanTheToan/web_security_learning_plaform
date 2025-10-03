package web_security_plaform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import web_security_plaform.backend.model.Lab;

@Repository
public interface LabRepository extends JpaRepository<Lab, Integer> {

}
