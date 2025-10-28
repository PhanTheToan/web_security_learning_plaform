package web_security_plaform.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import web_security_plaform.backend.payload.dto.LabInfoDetail;
import web_security_plaform.backend.service.LabService;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/lab")
public class LabController {
    @Autowired
    private LabService labService;


    @GetMapping()
    public ResponseEntity<?> getAllLabs(){
        return ResponseEntity.ok(labService.getAllLabs());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<LabInfoDetail>> filterLabs(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Set<Integer> tagIds) {

        List<LabInfoDetail> filteredLabs = labService.filterByNameAndTags(name, tagIds);

        return ResponseEntity.ok(filteredLabs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLabDetailByIdForUser(@PathVariable Integer id){
        return ResponseEntity.ok(labService.getLabDetailByUser(id));
    }
}
