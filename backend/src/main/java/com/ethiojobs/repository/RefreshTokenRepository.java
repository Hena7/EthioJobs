package com.ethiojobs.repository;

import com.ethiojobs.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    @Modifying
    @Query("delete from RefreshToken rt where rt.user.id = :userId")
    void deleteByUserId(Long userId);

    @Modifying
    @Query("delete from RefreshToken rt where rt.expiresAt < :now or rt.revokedAt is not null")
    void deleteExpiredOrRevoked(LocalDateTime now);
}
