package web_security_plaform.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import web_security_plaform.backend.model.ENum.EStatus;
import web_security_plaform.backend.model.Topic;
import web_security_plaform.backend.payload.dto.TopicsResponse;
import web_security_plaform.backend.repository.TopicRepository;
import web_security_plaform.backend.service.LeaderboardService;
import web_security_plaform.backend.service.TagService;
import web_security_plaform.backend.service.TopicService;


import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    @Autowired
    private TagService tagService;

    @Autowired
    private TopicService topicService;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/tags")
    public List<?> getTagName(){
        return tagService.getTagName();
    }

    @GetMapping("/topics")
    public ResponseEntity<Page<TopicsResponse>> getAllTopics(@RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(topicService.getAllTopDetailsForUser(page, size));
    }

    @GetMapping("/topic/{id}")
    public ResponseEntity<?> getInformationTopicForUser(@PathVariable long id){
        Topic topic = topicRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Topic not found with id " + id));
        if(!topic.getStatus().equals(EStatus.Published)){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(topicService.getTopicDetailById(id));
    }
    @GetMapping("/top-10")
    public ResponseEntity<List<?>> getTop10Leaderboard() {
        return ResponseEntity.ok(leaderboardService.getTop10Leaderboard());
    }
}
