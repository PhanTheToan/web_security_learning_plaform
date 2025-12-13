package web_security_plaform.backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import web_security_plaform.backend.model.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query("""
      select u.id
      from User u
      where u.email is not null
        and (:status is null or u.status = :status)
    """)
    List<Long> findIdsForEmailGroupSync(@Param("status") Integer status);
}
