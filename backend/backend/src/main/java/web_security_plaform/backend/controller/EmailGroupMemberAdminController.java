package web_security_plaform.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.payload.dto.email.*;
import web_security_plaform.backend.service.EmailGroupMemberService;

@RestController
@RequestMapping("/api/admin/email/groups/{groupId}/members")
@RequiredArgsConstructor
public class EmailGroupMemberAdminController {

    private final EmailGroupMemberService memberService;

    @GetMapping("/count")
    public ResponseEntity<Long> count(@PathVariable Long groupId) {
        return ResponseEntity.ok(memberService.count(groupId));
    }

    @GetMapping
    public ResponseEntity<Page<Long>> listUserIds(
            @PathVariable Long groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        return ResponseEntity.ok(memberService.listMemberUserIds(groupId, page, size));
    }

    @PostMapping
    public ResponseEntity<BulkMembersRes> add(@PathVariable Long groupId, @RequestBody BulkMembersReq req) {
        return ResponseEntity.ok(memberService.addMembers(groupId, req));
    }

    @DeleteMapping
    public ResponseEntity<BulkMembersRes> remove(@PathVariable Long groupId, @RequestBody BulkMembersReq req) {
        return ResponseEntity.ok(memberService.removeMembers(groupId, req));
    }


    @PostMapping("/sync")
    public ResponseEntity<BulkMembersRes> sync(@PathVariable Long groupId, @RequestBody SyncGroupReq req) {
        return ResponseEntity.ok(memberService.syncGroup(groupId, req));
    }
}
