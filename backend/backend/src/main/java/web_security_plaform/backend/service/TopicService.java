package web_security_plaform.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import web_security_plaform.backend.model.ENum.EStatus;
import web_security_plaform.backend.model.Lab;
import web_security_plaform.backend.model.Tag;
import web_security_plaform.backend.model.Topic;
import web_security_plaform.backend.model.User;
import web_security_plaform.backend.payload.dto.*;
import web_security_plaform.backend.payload.request.TopicRequest;
import web_security_plaform.backend.repository.LabRepository;
import web_security_plaform.backend.repository.TagRepository;
import web_security_plaform.backend.repository.TopicRepository;

import java.security.Principal;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TopicService {
    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private TagRepository tagRepository;

    public Topic createTopic(TopicRequest topicRequest, User user) {
        Topic topic = new Topic();

        topic.setAuthor(user);
        topic.setTitle(topicRequest.getTitle());
        topic.setStatus(topicRequest.getStatus());
        topic.setContent(topicRequest.getContent());

        topic.setAuthor(user);

        if (topicRequest.getLabsId() != null && !topicRequest.getLabsId().isEmpty()) {
            Set<Lab> labs = new HashSet<>(labRepository.findAllById(topicRequest.getLabsId()));
            topic.setLabs(labs);
        }
        if (topicRequest.getTagId() != null && !topicRequest.getTagId().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(topicRequest.getTagId()));
            topic.setTags(tags);
        }
        return topicRepository.save(topic);
    }

    public Topic updateTopics(TopicRequest topicRequest, long id, User user) {
        Topic topic = topicRepository.findById(id).orElseThrow();

        topic.setAuthor(user);

        topic.setStatus(topicRequest.getStatus());
        topic.setContent(topicRequest.getContent());

        topic.setAuthor(user);

        if (topicRequest.getLabsId() != null && !topicRequest.getLabsId().isEmpty()) {
            Set<Lab> labs = new HashSet<>(labRepository.findAllById(topicRequest.getLabsId()));
            topic.setLabs(labs);
        }
        if (topicRequest.getTagId() != null && !topicRequest.getTagId().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(topicRequest.getTagId()));
            topic.setTags(tags);
        }
        return topicRepository.save(topic);
    }

    @Transactional(readOnly = true)
    public Page<TopicsResponse> getAllTopDetails(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Topic> topicsPage = topicRepository.findTopicsWithAuthor(pageable);

        return topicsPage.map(this::convertToDto);
    }

    private TopicsResponse convertToDto(Topic topic) {
        User user = topic.getAuthor();

        TopicsResponse dto = new TopicsResponse();
        dto.setId(topic.getId());
        dto.setTitle(topic.getTitle());
        dto.setAuthorName(user.getFullName());
        dto.setStatus(topic.getStatus());
        Set<TagDTO> tagDTOs = topic.getTags() != null ? topic.getTags().stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                .collect(Collectors.toSet()) : Collections.emptySet();
        dto.setTags(tagDTOs);
        return dto;
    }

    @Transactional(readOnly = true)
    public Page<TopicsResponse> getAllTopDetailsForUser(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Topic> topicsPage = topicRepository.findTopicsWithAuthor(pageable);
        List<TopicsResponse> publicTopics = topicsPage.getContent().stream()
                .filter(topic -> topic.getStatus().equals(EStatus.Published))
                .map(this::convertToDtoForUser)
                .collect(Collectors.toList());

        return new PageImpl<>(publicTopics, pageable, publicTopics.size());
    }

    private TopicsResponse convertToDtoForUser(Topic topic) {
        User user = topic.getAuthor();

        TopicsResponse dto = new TopicsResponse();
        dto.setId(topic.getId());
        dto.setTitle(topic.getTitle());
        dto.setAuthorName(user.getFullName());
        dto.setStatus(topic.getStatus());
        Set<TagDTO> tagDTOs = topic.getTags() != null ? topic.getTags().stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                .collect(Collectors.toSet()) : Collections.emptySet();
        dto.setTags(tagDTOs);
        return dto;
    }

    @Transactional(readOnly = true)
    public TopicDetailDTO getTopicDetailById(long id) {
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Topic not found with id " + id));

        return toDto(topic);
    }

    private TopicDetailDTO toDto(Topic t) {
        TopicDetailDTO dto = new TopicDetailDTO();
        dto.setContent(t.getContent());
        dto.setId(t.getId());
        dto.setTitle(t.getTitle());
        dto.setStatus(t.getStatus());

        Set<LabInfoDetail> labDto = t.getLabs().stream()
                .map(l -> {
                    LabInfoDetail li = new LabInfoDetail();
                    li.setId(l.getId());
                    li.setName(l.getName());
                    li.setEStatus(l.getStatus());
                    li.setDifficulty(l.getDifficulty());
                    return li;
                })
                .collect(java.util.stream.Collectors.toCollection(java.util.LinkedHashSet::new));

        dto.setLabs(labDto);
        Set<TagDTO> tagDTOs = t.getTags() != null ? t.getTags().stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName()))
                .collect(Collectors.toSet()) : Collections.emptySet();
        dto.setTags(tagDTOs);
        return dto;

    }

//    public ResponseEntity<?> getTop10UsersByReputation() {
//
//    }
}
