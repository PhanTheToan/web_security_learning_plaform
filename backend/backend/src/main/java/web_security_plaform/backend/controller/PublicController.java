package web_security_plaform.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import web_security_plaform.backend.service.TagService;


import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    @Autowired
    private TagService tagService;

    @GetMapping("/tags")
    public List<?> getTagName(){
        return tagService.getTagName();
    }
}
