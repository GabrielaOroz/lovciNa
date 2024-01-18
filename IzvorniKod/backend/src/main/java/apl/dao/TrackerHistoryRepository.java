package apl.dao;

import apl.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TrackerHistoryRepository extends JpaRepository<TrackerHistory, Long> {

    List<TrackerHistory> findByTrackerId(Long id);
}
