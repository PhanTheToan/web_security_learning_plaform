package web_security_plaform.backend.service;

import org.checkerframework.checker.units.qual.s;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import web_security_plaform.backend.model.ENum.ESolutionStatus;
import web_security_plaform.backend.model.ENum.EStatus;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.LabSession;
import web_security_plaform.backend.model.Tag;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.CommunitySolutionsDTO;
import web_security_plaform.backend.payload.dto.LabDetailDto;
import web_security_plaform.backend.payload.dto.LabInfoDetail;
import web_security_plaform.backend.payload.dto.TagDTO;
import web_security_plaform.backend.payload.request.LabRequest;
import web_security_plaform.backend.repository.CommunitySolutionRepository;
import web_security_plaform.backend.repository.LabRepository;
import web_security_plaform.backend.repository.LabSessionRepository;
import web_security_plaform.backend.repository.TagRepository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LabService {
    @Autowired
    private LabRepository labRepository;

    @Autowired
    private CommunitySolutionRepository communitySolutionRepository;

    @Autowired
    private LabSessionRepository labSessionRepository;

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
        newLab.setLinkSource(labRequest.getLinkSource());
        newLab.setFlag(labRequest.getFlag());

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

        Set<TagDTO> tagDTOs = lab.getTags() != null ? lab.getTags().stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                .collect(Collectors.toSet()) : Collections.emptySet();

        LabDetailDto dto = new LabDetailDto();
        dto.setId(lab.getId());
        dto.setName(lab.getName());
        dto.setDifficulty(lab.getDifficulty());
        dto.setDockerImage(lab.getDockerImage());
        dto.setStatus(lab.getStatus());
        dto.setAuthorName(authorName);
        dto.setTags(tagDTOs);
        dto.setLinkSource(lab.getLinkSource());

        return dto;
    }

    public LabDetailDto getLabDetailById(int id) {
        return labRepository.findById(id)
                .map(this::convertToDtoAllInformation)
                .orElse(null);
    }

    public LabDetailDto getLabDetailByUser(int id) {
        return labRepository.findById(id)
                .filter(lab -> lab.getStatus().equals(EStatus.Published))
                .map(this::convertToDtoAllInformationForUser)
                .orElse(null);
    }

    private LabDetailDto convertToDtoAllInformation(Lab lab) {
        User author = lab.getAuthor();
        String authorName = author.getFullName();

        Set<TagDTO> tagDTOs = lab.getTags() != null ? lab.getTags().stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                .collect(Collectors.toSet()) : Collections.emptySet();

        List<CommunitySolutionsDTO> communitySolutions = communitySolutionRepository.findByLabId(lab.getId())
                .stream()
                .map(solution -> {
                    CommunitySolutionsDTO dto = new CommunitySolutionsDTO();
                    dto.setId(solution.getId());
                    dto.setFullName(solution.getUser().getFullName());
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
        dto.setLinkSource(lab.getLinkSource());
        dto.setFlag(lab.getFlag());

        dto.setCommunitySolutionDTOS(communitySolutions);

        return dto;
    }

    private LabDetailDto convertToDtoAllInformationForUser(Lab lab) {
        User author = lab.getAuthor();
        String authorName = author.getFullName();

        Set<TagDTO> tagDTOs = lab.getTags() != null ? lab.getTags().stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                .collect(Collectors.toSet()) : Collections.emptySet();

        List<CommunitySolutionsDTO> communitySolutions = communitySolutionRepository.findByLabId(lab.getId())
                .stream().filter(s->s.getStatus().equals(ESolutionStatus.Approved))
                .map(solution -> {
                    CommunitySolutionsDTO dto = new CommunitySolutionsDTO();
                    dto.setId(solution.getId());
                    dto.setFullName(solution.getUser().getFullName());
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
        dto.setStatus(lab.getStatus());
        dto.setAuthorName(authorName);
        dto.setTags(tagDTOs);
        dto.setDescription(lab.getDescription());
        dto.setHint(lab.getHint());
        dto.setSolution(lab.getSolution());
        dto.setFixVulnerabilities(lab.getFixVulnerabilities());
        dto.setTimeoutMinutes(lab.getTimeoutMinutes());
        dto.setLinkSource(lab.getLinkSource());

        List<LabSession> labSessions =
                labSessionRepository.findAllFirstSolvedSessionsByLabId(lab.getId());

        List<RecentSolvedLab> recentFirstSolves = labSessions.stream()
                .map(ls -> new RecentSolvedLab(
                        ls.getUser().getFullName(),
                        ls.getCompletedAt()
                ))
                .toList();
        dto.setRecentSolvedLabs(recentFirstSolves);
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
        newLab.setLinkSource(labRequest.getLinkSource());
        newLab.setFlag(labRequest.getFlag());
        newLab.setAuthor(author);

        if (labRequest.getTagIds() != null) {
            Set<Tag> foundTags = new HashSet<>(tagRepository.findAllById(labRequest.getTagIds()));
            newLab.setTags(foundTags);
        }

        return labRepository.save(newLab);
    }

    private LabInfoDetail toLabInfoDetail(Lab lab) {
        LabInfoDetail dto = new LabInfoDetail();
        dto.setId(lab.getId());
        dto.setName(lab.getName());
        dto.setEStatus(lab.getStatus()); // map field status -> eStatus
        dto.setDifficulty(lab.getDifficulty());
        return dto;
    }

    @Transactional(readOnly = true)
    public Optional<LabInfoDetail> findLabInfoById(Integer id) {
        return labRepository.findById(id).map(this::toLabInfoDetail);
    }

    @Transactional(readOnly = true)
    public List<LabInfoDetail> findLabInfosByName(String name, boolean like) {
        List<Lab> labs = like
                ? labRepository.findByNameContainingIgnoreCase(name)
                : labRepository.findByNameIgnoreCase(name);
        return labs.stream().map(this::toLabInfoDetail).collect(Collectors.toList());
    }

    public ResponseEntity<?> getAllLabs() {
        List<Lab> labs = labRepository.findAllWithTags();
        List<LabInfoDetail> labInfoDetails = labs.stream()
                .filter(lab -> lab.getStatus().equals(EStatus.Published))
                .map(this::toLabInfoDetailByLab)
                .collect(Collectors.toList());
        return ResponseEntity.ok(labInfoDetails);
    }

    public LabInfoDetail toLabInfoDetailByLab(Lab lab) {
        LabInfoDetail dto = new LabInfoDetail();
        dto.setId(lab.getId());
        dto.setName(lab.getName());
        dto.setEStatus(lab.getStatus());
        Set<TagDTO> tagDTOs = lab.getTags() != null ? lab.getTags().stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                .collect(Collectors.toSet()) : Collections.emptySet();
        dto.setTags(tagDTOs);
        return dto;
    }

    public List<LabInfoDetail> filterByNameAndTags(String name, Set<Integer> tagIds) {

        String nameQuery = "%" + (name == null ? "" : name) + "%";

        List<Lab> labs;

        if (tagIds == null || tagIds.isEmpty()) {
            labs = labRepository.findByNameContainingWithTags(nameQuery);
        } else {
            Set<Tag> tagEntities = new HashSet<>(tagRepository.findAllById(tagIds));

            Long tagCount = (long) tagEntities.size();

            labs = labRepository.findByNameContainingAndAllTags(nameQuery, tagEntities, tagCount);
        }

        return labs.stream()
                .filter(lab -> lab.getStatus().equals(EStatus.Published))
                .map(this::toLabInfoDetailByLab)
                .collect(Collectors.toList());
    }

    public Lab getLabById(Integer labId) {
        return labRepository.findById(labId)
                .orElseThrow(() -> new RuntimeException("Lab not found with id: " + labId));
    }
    public record RecentSolvedLab(
           String fullName,
           Instant lastSolvedDate
    ) { }
}
