package web_security_plaform.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.Tag;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.request.LabRequest;
import web_security_plaform.backend.repository.LabRepository;
import web_security_plaform.backend.repository.TagRepository;

import java.util.HashSet;
import java.util.Set;

@Service
public class LabService {
    @Autowired
    private LabRepository labRepository;


    @Autowired
    private TagRepository tagRepository;

    public Lab createLab(LabRequest labRequest, User author) {
        Lab newLab = new Lab();

        newLab.setName(labRequest.getName());
        newLab.setDescription(labRequest.getDescription());
        newLab.setSolution(labRequest.getSolution());
        newLab.setHint(labRequest.getHint());
        newLab.setFixVulnerabilities(labRequest.getFixVulnerabilities());
        newLab.setDockerImage(labRequest.getDockerImage());
        newLab.setDifficulty(labRequest.getDifficulty());
        newLab.setTimeoutMinutes(labRequest.getTimeoutMinutes());
        newLab.setStatus(labRequest.getStatus());

        newLab.setAuthor(author);

        if (labRequest.getTagIds() != null && !labRequest.getTagIds().isEmpty()) {
            Set<Tag> foundTags = new HashSet<>(tagRepository.findAllById(labRequest.getTagIds()));
            newLab.setTags(foundTags);
        }

        return labRepository.save(newLab);
    }
}
