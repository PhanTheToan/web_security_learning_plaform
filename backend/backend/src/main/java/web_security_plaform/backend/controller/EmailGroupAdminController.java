package web_security_plaform.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.payload.dto.email.*;
import web_security_plaform.backend.model.EmailGroup;
import web_security_plaform.backend.service.EmailGroupService;

@RestController
@RequestMapping("/api/admin/email/groups")
@RequiredArgsConstructor
public class EmailGroupAdminController {

    private final EmailGroupService groupService;

    @PostMapping
    public ResponseEntity<EmailGroup> create(@RequestBody CreateGroupReq req) {
        return ResponseEntity.ok(groupService.create(req));
    }

    @GetMapping
    public ResponseEntity<Page<EmailGroup>> list(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(groupService.list(q, page, size));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<EmailGroup> get(@PathVariable Long groupId) {
        return ResponseEntity.ok(groupService.get(groupId));
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<EmailGroup> update(@PathVariable Long groupId, @RequestBody UpdateGroupReq req) {
        return ResponseEntity.ok(groupService.update(groupId, req));
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> delete(@PathVariable Long groupId) {
        groupService.delete(groupId);
        return ResponseEntity.noContent().build();
    }
}
