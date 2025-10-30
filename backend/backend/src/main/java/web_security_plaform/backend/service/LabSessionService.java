package web_security_plaform.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import web_security_plaform.backend.model.LabSession;
import web_security_plaform.backend.repository.LabRepository;
import web_security_plaform.backend.repository.LabSessionRepository;

import java.util.List;

@Service
public class LabSessionService {

    @Autowired
    private LabSessionRepository labSessionRepository;

    @Autowired
    private LabRepository labRepository;


    public List<LabSession> findLabSessionsByUserIdAndLabId(Integer id, Integer labId) {
        return labSessionRepository.findLabSessionsByUserIdAndLabId(id, labId);
    }
}
