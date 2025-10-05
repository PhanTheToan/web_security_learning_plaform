package web_security_plaform.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.Tag;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.CommunitySolutionsDTO;
import web_security_plaform.backend.payload.dto.LabDetailDto;
import web_security_plaform.backend.payload.dto.TagDTO;
import web_security_plaform.backend.payload.request.LabRequest;
import web_security_plaform.backend.repository.CommunitySolutionRepository;
import web_security_plaform.backend.repository.LabRepository;
import web_security_plaform.backend.repository.TagRepository;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class LabService {
    @Autowired
    private LabRepository labRepository;

    @Autowired
    private CommunitySolutionRepository communitySolutionRepository;

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

    @Transactional(readOnly = true)
    public Page<LabDetailDto> getAllLabDetails(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Lab> labPage = labRepository.findLabsWithAuthor(pageable);

        List<Lab> labsOnPage = labPage.getContent();

        if (!labsOnPage.isEmpty()) {
            labRepository.findWithTags(labsOnPage);
        }

        return labPage.map(this::convertToDto);
    }

    private LabDetailDto convertToDto(Lab lab) {
        User author = lab.getAuthor();
        String authorName = author.getFullName();

        Set<TagDTO> tagDTOs = lab.getTags() != null ?
                lab.getTags().stream()
                        .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                        .collect(Collectors.toSet()) :
                Collections.emptySet();

        LabDetailDto dto = new LabDetailDto();
        dto.setId(lab.getId());
        dto.setName(lab.getName());
        dto.setDifficulty(lab.getDifficulty());
        dto.setDockerImage(lab.getDockerImage());
        dto.setStatus(lab.getStatus());
        dto.setAuthorName(authorName);
        dto.setTags(tagDTOs);

        return dto;
    }

    public LabDetailDto getLabDetailById(int id) {
        return labRepository.findById(id)
                .map(this::convertToDtoAllInformation)
                .orElse(null);
    }
    private LabDetailDto convertToDtoAllInformation(Lab lab) {
        User author = lab.getAuthor();
        String authorName = author.getFullName();

        Set<TagDTO> tagDTOs = lab.getTags() != null ?
                lab.getTags().stream()
                        .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                        .collect(Collectors.toSet()) :
                Collections.emptySet();

        List<CommunitySolutionsDTO> communitySolutions = communitySolutionRepository.findByLabId(lab.getId())
                .stream()
                .map(solution -> {
                    CommunitySolutionsDTO dto = new CommunitySolutionsDTO();
                    dto.setId(solution.getId());
                    dto.setStatus(solution.getStatus());
                    dto.setWriteup(solution.getWriteUpUrl());
                    dto.setYoutubeUrl(solution.getYoutubeUrl());
                    dto.setLabId(solution.getLab().getId());
                    dto.setUserId(solution.getUser().getId());
                    return dto;
                })
                .collect(Collectors.toList());

        LabDetailDto dto = new LabDetailDto();
        dto.setId(lab.getId());
        dto.setName(lab.getName());
        dto.setDifficulty(lab.getDifficulty());
        dto.setDockerImage(lab.getDockerImage());
        dto.setStatus(lab.getStatus());
        dto.setAuthorName(authorName);
        dto.setTags(tagDTOs);
        dto.setDescription(lab.getDescription());
        dto.setHint(lab.getHint());
        dto.setSolution(lab.getSolution());
        dto.setFixVulnerabilities(lab.getFixVulnerabilities());
        dto.setTimeoutMinutes(lab.getTimeoutMinutes());

        dto.setCommunitySolutionDTOS(communitySolutions);

        return dto;
    }


    public Lab updateLabs(LabRequest labRequest, User author, int id) {
        Lab newLab = labRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab not found with id: " + id));

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
