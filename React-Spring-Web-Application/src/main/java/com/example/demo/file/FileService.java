package com.example.demo.file;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.tika.Tika;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.configuration.AppConfiguration;
import com.example.demo.user.User;

@Service
@EnableScheduling
public class FileService {

	AppConfiguration appConfiguration;

	Tika tika;

	IFileAttachmentRepository fileAttachmentRepository;

	public FileService(AppConfiguration appConfiguration, IFileAttachmentRepository fileAttachmentRepository) {
		super();
		this.appConfiguration = appConfiguration;
		this.tika = new Tika();
		this.fileAttachmentRepository = fileAttachmentRepository;
	}

	public String writeBase64EncodedStringToFile(String image) throws IOException {

		String fileName = generateRandomName();
		File target = new File(appConfiguration.getProfileStoragePath() + "/" + fileName);
		OutputStream outputStream = new FileOutputStream(target);

		byte[] base64encoded = Base64.getDecoder().decode(image);

		outputStream.write(base64encoded);
		outputStream.close();
		return fileName;
	}

	public String generateRandomName() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	public void deleteProfileImage(String oldImageName) {
		if (oldImageName == null) {
			return;
		}
		deleteFile(Paths.get(appConfiguration.getProfileStoragePath(), oldImageName));
	}

	public void deleteAttachmentFile(String oldImageName) {
		if (oldImageName == null) {
			return;
		}
		deleteFile(Paths.get(appConfiguration.getAttachmentStoragePath(), oldImageName));
	}

	private void deleteFile(Path path) {
		try {
			Files.deleteIfExists(path);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public String detectType(String base64) {
		byte[] base64encoded = Base64.getDecoder().decode(base64);
		return detectType(base64encoded);
	}

	public String detectType(byte[] arr) {
		String fileType = tika.detect(arr);
		return fileType;
	}

	public FileAttachment saveMessageAttachment(MultipartFile multipartFile) {
		String fileName = generateRandomName();
		File target = new File(appConfiguration.getAttachmentStoragePath() + "/" + fileName);
		String fileType = null;
		try {
			byte[] arr = multipartFile.getBytes();
			OutputStream outputStream = new FileOutputStream(target);
			outputStream.write(arr);
			outputStream.close();
			fileType = detectType(arr);
		} catch (IOException e) {
			e.printStackTrace();
		}
		FileAttachment fileAttachment = new FileAttachment();
		fileAttachment.setName(fileName);
		fileAttachment.setDate(new Date());
		fileAttachment.setFileType(fileType);	

		return fileAttachmentRepository.save(fileAttachment);
	}

	// 24 * 60 * 60 * 1000 one day
	@Scheduled(fixedRate = 60 * 1000)
	public void cleanupStorage() {
		Date twentyFourHoursAgo = new Date(System.currentTimeMillis() - (10 * 1000));
		List<FileAttachment> filesToBeDeleted = fileAttachmentRepository
				.findByDateBeforeAndMessageIsNull(twentyFourHoursAgo);
		for (FileAttachment file : filesToBeDeleted) {
			// delete file
			deleteAttachmentFile(file.getName());
			// delete from table
			fileAttachmentRepository.deleteById(file.getId());
		}
	}

	public void deleteAllStoredFilesForUser(User inDB) {
		deleteProfileImage(inDB.getImage());
		List<FileAttachment> filesToBeRemoved = fileAttachmentRepository.findByMessageUser(inDB);
		for(FileAttachment file: filesToBeRemoved) {
			deleteAttachmentFile(file.getName());
		}
	}

}
