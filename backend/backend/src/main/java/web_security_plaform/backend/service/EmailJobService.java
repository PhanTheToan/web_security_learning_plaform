package web_security_plaform.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import web_security_plaform.backend.model.EmailJob;
import web_security_plaform.backend.model.ENum.EmailJobStatus;
import web_security_plaform.backend.repository.EmailJobRepository;

import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class EmailJobService {

    private final EmailJobRepository jobRepo;
    private static final AtomicLong SEQ = new AtomicLong(0);

    public EmailJob get(String jobId) {
        return jobRepo.findById(jobId).orElseThrow(() -> new IllegalArgumentException("Job not found: " + jobId));
    }

    public Page<EmailJob> list(Integer page, Integer size, EmailJobStatus status, Long groupId) {
        Pageable pageable = PageRequest.of(page == null ? 0 : page, size == null ? 20 : size,
                Sort.by(Sort.Direction.DESC, "createdAt"));
        if (groupId != null) return jobRepo.findByGroupId(groupId, pageable);
        if (status != null) return jobRepo.findByStatus(status, pageable);
        return jobRepo.findAll(pageable);
    }

    @Transactional
    public EmailJob createQueued(Long groupId, String templateName, String subject) {
        String id = "JOB-" + System.currentTimeMillis() + "-" + String.format("%06d", SEQ.incrementAndGet());
        EmailJob job = EmailJob.builder()
                .id(id)
                .groupId(groupId)
                .templateName(templateName)
                .subject(subject)
                .status(EmailJobStatus.QUEUED)
                .total(0).sent(0).failed(0)
                .createdAt(LocalDateTime.now())
                .build();
        return jobRepo.save(job);
    }

    @Transactional
    public void markRunning(String jobId, int total) {
        EmailJob job = get(jobId);
        job.setStatus(EmailJobStatus.RUNNING);
        job.setStartedAt(LocalDateTime.now());
        job.setTotal(total);
        jobRepo.save(job);
    }

    @Transactional
    public void incSent(String jobId) {
        EmailJob job = get(jobId);
        job.setSent(job.getSent() + 1);
        jobRepo.save(job);
    }

    @Transactional
    public void incFailed(String jobId, String err) {
        EmailJob job = get(jobId);
        job.setFailed(job.getFailed() + 1);
        job.setLastError(err);
        jobRepo.save(job);
    }

    @Transactional
    public void markCompleted(String jobId) {
        EmailJob job = get(jobId);
        job.setStatus(EmailJobStatus.COMPLETED);
        job.setFinishedAt(LocalDateTime.now());
        jobRepo.save(job);
    }

    @Transactional
    public void pause(String jobId) {
        EmailJob job = get(jobId);
        job.setStatus(EmailJobStatus.PAUSED);
        jobRepo.save(job);
    }

    @Transactional
    public void resume(String jobId) {
        EmailJob job = get(jobId);
        job.setStatus(EmailJobStatus.QUEUED);
        jobRepo.save(job);
    }

    @Transactional
    public void cancel(String jobId) {
        EmailJob job = get(jobId);
        job.setStatus(EmailJobStatus.CANCELED);
        jobRepo.save(job);
    }
}
