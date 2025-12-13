package web_security_plaform.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import web_security_plaform.backend.model.EmailGroupMember;

public interface EmailGroupMemberRepository extends JpaRepository<EmailGroupMember, Long> {

    @Query("""
        select u.email
        from User u
        where u.email is not null
          and u.id in (
              select m.userId
              from EmailGroupMember m
              where m.groupId = :groupId
          )
    """)
    Page<String> findEmailsByGroupId(@Param("groupId") Long groupId, Pageable pageable);
}
