package web_security_plaform.backend.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import web_security_plaform.backend.model.EmailGroupMember;

import java.util.List;

public interface EmailGroupMemberRepository extends JpaRepository<EmailGroupMember, Long> {

    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

    long countByGroupId(Long groupId);

    @Modifying
    @Query("delete from EmailGroupMember m where m.groupId = :groupId and m.userId in :userIds")
    int deleteMembers(@Param("groupId") Long groupId, @Param("userIds") List<Long> userIds);

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

    @Query("""
        select u.id
        from User u
        where u.email is not null
          and u.id in (
              select m.userId
              from EmailGroupMember m
              where m.groupId = :groupId
          )
    """)
    Page<Long> findUserIdsByGroupId(@Param("groupId") Long groupId, Pageable pageable);
}
