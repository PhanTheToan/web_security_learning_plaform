package web_security_plaform.backend.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import web_security_plaform.backend.model.Tag;
import web_security_plaform.backend.payload.dto.TagDTO;
import web_security_plaform.backend.repository.TagRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    @Transactional
    public Tag createTag(Tag input) {
        if (input == null || input.getName() == null || input.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag name is required");
        }

        String name = input.getName().trim();

        if (tagRepository.existsByNameIgnoreCase(name)) {
            // 409 khi trùng
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tag name already exists");
        }

        Tag tag = new Tag();
        tag.setName(name);
        return tagRepository.save(tag);
    }

    public List<Tag> getTagName() {
        return  tagRepository.findAll();
    }
    public Optional<TagDTO> findTagDTOById(Integer id) {
        return tagRepository.findById(id).map(t -> new TagDTO(t.getId(), t.getName()));
    }
    public List<TagDTO> findTagDTOsByName(String name, boolean like) {
        if (like) {
            return tagRepository.findByNameContainingIgnoreCase(name)
                    .stream()
                    .map(t -> new TagDTO(t.getId(), t.getName()))
                    .collect(Collectors.toList());
        } else {
            return tagRepository.findByNameIgnoreCase(name)
                    .map(t -> List.of(new TagDTO(t.getId(), t.getName())))
                    .orElseGet(List::of);
        }
    }

    @Transactional
    public void deleteTag(int id, boolean force) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tag not found"));

        int labRefs   = tagRepository.countLabLinksByTagId(id);
        int topicRefs = tagRepository.countTopicLinksByTagId(id);
        int totalRefs = labRefs + topicRefs;

        if (totalRefs > 0 && !force) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tag is in use by " + totalRefs + " relation(s): labs=" + labRefs + ", topics=" + topicRefs +
                            ". Pass force=true to detach and delete."
            );
        }

        if (labRefs > 0)   tagRepository.deleteLabLinksByTagId(id);
        if (topicRefs > 0) tagRepository.deleteTopicLinksByTagId(id);

        tagRepository.delete(tag);
    }
}
