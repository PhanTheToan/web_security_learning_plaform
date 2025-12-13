package web_security_plaform.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web_security_plaform.backend.payload.dto.email.*;
import web_security_plaform.backend.model.EmailGroupMember;
import web_security_plaform.backend.repository.EmailGroupMemberRepository;
import web_security_plaform.backend.repository.UserRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
public class EmailGroupMemberService {

    private final EmailGroupMemberRepository memberRepo;
    private final UserRepository userRepo;

    public long count(Long groupId) {
        return memberRepo.countByGroupId(groupId);
    }

    @Transactional
    public BulkMembersRes addMembers(Long groupId, BulkMembersReq req) {
        BulkMembersRes res = new BulkMembersRes();
        if (req.getUserIds() == null || req.getUserIds().isEmpty()) return res;

        for (Long uid : req.getUserIds()) {
            if (!userRepo.existsById(uid)) { res.setSkipped(res.getSkipped() + 1); continue; }
            if (memberRepo.existsByGroupIdAndUserId(groupId, uid)) { res.setSkipped(res.getSkipped() + 1); continue; }
            memberRepo.save(EmailGroupMember.builder().groupId(groupId).userId(uid).build());
            res.setAdded(res.getAdded() + 1);
        }
        return res;
    }

    @Transactional
    public BulkMembersRes removeMembers(Long groupId, BulkMembersReq req) {
        BulkMembersRes res = new BulkMembersRes();
        if (req.getUserIds() == null || req.getUserIds().isEmpty()) return res;
        int removed = memberRepo.deleteMembers(groupId, req.getUserIds());
        res.setRemoved(removed);
        return res;
    }

    public Page<Long> listMemberUserIds(Long groupId, int page, int size) {
        return memberRepo.findUserIdsByGroupId(groupId, PageRequest.of(page, size));
    }

    @Transactional
    public BulkMembersRes syncGroup(Long groupId, SyncGroupReq req) {
        // Filter đơn giản: statusEquals (dạng int)
        List<Long> targetIds = userRepo.findIdsForEmailGroupSync(req.getStatusEquals());

        if (req.getMode() == SyncGroupReq.Mode.REPLACE) {
            // REPLACE: xóa hết rồi add lại
            memberRepo.deleteAll(memberRepo.findAll(
                    Example.of(EmailGroupMember.builder().groupId(groupId).build(),
                            ExampleMatcher.matching().withIgnorePaths("id", "userId"))
            ));
        }

        BulkMembersRes res = new BulkMembersRes();
        for (Long uid : targetIds) {
            if (memberRepo.existsByGroupIdAndUserId(groupId, uid)) { res.setSkipped(res.getSkipped() + 1); continue; }
            memberRepo.save(EmailGroupMember.builder().groupId(groupId).userId(uid).build());
            res.setAdded(res.getAdded() + 1);
        }
        return res;
    }
}
