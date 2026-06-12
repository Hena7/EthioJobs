package com.ethiojobs.repository;

import com.ethiojobs.entity.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByContractIdOrderByWorkDateDesc(Long contractId);
}
