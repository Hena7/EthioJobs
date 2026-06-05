package com.ethiojobs.service.impl;

import com.ethiojobs.exception.BadRequestException;
import com.ethiojobs.service.FileStorageService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageServiceImpl.class);

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path uploadPath;

    @PostConstruct
    public void init() {
        uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadPath, e);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDir) {
        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            throw new BadRequestException("File must have a name");
        }

        String extension = "";
        int dot = originalName.lastIndexOf('.');
        if (dot > 0) {
            extension = originalName.substring(dot);
        }
        String storedName = UUID.randomUUID() + extension;

        Path targetDir = uploadPath.resolve(subDir);
        try {
            Files.createDirectories(targetDir);
            Path target = targetDir.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return subDir + "/" + storedName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + originalName, e);
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            Path file = uploadPath.resolve(fileUrl).normalize();
            if (file.startsWith(uploadPath)) {
                Files.deleteIfExists(file);
            }
        } catch (IOException e) {
            log.warn("Failed to delete file: {}", fileUrl, e);
        }
    }
}
