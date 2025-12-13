package web_security_plaform.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web_security_plaform.backend.payload.dto.email.CreateGroupReq;
import web_security_plaform.backend.payload.dto.email.UpdateGroupReq;
import web_security_plaform.backend.model.EmailGroup;
import web_security_plaform.backend.repository.EmailGroupRepository;

@Service
@RequiredArgsConstructor
public class EmailGroupService {

    private final EmailGroupRepository groupRepo;

    @Transactional
    public EmailGroup create(CreateGroupReq req) {
        groupRepo.findByName(req.getName()).ifPresent(g -> {
            throw new IllegalArgumentException("Group name already exists: " + req.getName());
        });
        EmailGroup g = EmailGroup.builder()
                .name(req.getName())
                .description(req.getDescription())
                .build();
        return groupRepo.save(g);
    }

    public Page<EmailGroup> list(String q, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        if (q == null || q.isBlank()) return groupRepo.findAll(pageable);
        return groupRepo.findByNameContainingIgnoreCase(q, pageable);
    }

    public EmailGroup get(Long groupId) {
        return groupRepo.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found: " + groupId));
    }

    @Transactional
    public EmailGroup update(Long groupId, UpdateGroupReq req) {
        EmailGroup g = get(groupId);
        if (req.getName() != null && !req.getName().isBlank() && !req.getName().equals(g.getName())) {
            groupRepo.findByName(req.getName()).ifPresent(x -> {
                throw new IllegalArgumentException("Group name already exists: " + req.getName());
            });
            g.setName(req.getName());
        }
        if (req.getDescription() != null) g.setDescription(req.getDescription());
        return groupRepo.save(g);
    }

    @Transactional
    public void delete(Long groupId) {
        groupRepo.deleteById(groupId);
    }
}
