package web_security_plaform.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.model.Tag;
import web_security_plaform.backend.repository.TagRepository;

import java.util.List;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public List<Tag> getTagName() {
        return  tagRepository.findAll();
    }
}
