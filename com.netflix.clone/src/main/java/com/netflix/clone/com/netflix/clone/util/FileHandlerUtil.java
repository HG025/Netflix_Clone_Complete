package com.netflix.clone.com.netflix.clone.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

public class FileHandlerUtil {
    private FileHandlerUtil() {}

    public static String extractFileExtension(String orignalFilename){
        String fileExtension = "";
        if(orignalFilename != null && orignalFilename.contains(".")){
            fileExtension = orignalFilename.substring(orignalFilename.lastIndexOf("."));
        }
        return fileExtension;
    }

    public static Path findFileByUuid(Path directory,String uuid) throws Exception{
        return Files.list(directory).filter(path-> path.getFileName().toString().startsWith(uuid))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("File not found for UUID" +uuid));
    }

    public static String detectVideoContentType(String filename){
        if(filename == null) return "video/mp4";
        if(filename.endsWith(".webm")) return "video/webm";
        if(filename.endsWith(".ogg")) return "video/ogg";
        if(filename.endsWith(".mkv")) return "video/x-matroska";
        if(filename.endsWith(".mvi")) return "video/x-msvideo";
        if(filename.endsWith(".nov")) return "video/quicktime";
        if(filename.endsWith(".flv")) return "video/x-flv";
        if(filename.endsWith(".wnv")) return "video/x-ns-wnv";
        if(filename.endsWith(".n4v")) return "video/x-n4v";
        if(filename.endsWith(".3gp")) return "video/3gp";
        if(filename.endsWith(".mpg") || filename.endsWith(".mpeg")) return "video/mpeg";

        return "video/mp4";
    }

    public static String detectImageContentType(String filename){
        if(filename == null) return "image/jpeg";

        if(filename.endsWith(".png")) return "image/png";
        if(filename.endsWith(".gif")) return "image/gif";
        if(filename.endsWith(".webp")) return "image/webp";

        return "image/jpeg";
    }

    public static Long[] parseRangeHeader(String rangeHeader, long fileLength){
        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
        long rangeStart = Long.parseLong(ranges[0]);
        long rangeEnd = ranges.length > 1 && !ranges[1].isEmpty() ? Long.parseLong(ranges[1]) : fileLength -1;
        return new Long[] {rangeStart, rangeEnd};
    }

    public static Resource createRangeResource(Path filePath, long rangeStart, long rangeLength) throws IOException{
        RandomAccessFile fileReader = new RandomAccessFile(filePath.toFile(), "r");
        fileReader.seek(rangeStart);

        InputStream partialContentStream = new InputStream() {
            private long totalBytesRead = 0;

            @Override
            public int read() throws IOException{
                if(totalBytesRead >= rangeLength){
                    fileReader.close();
                    return -1;
                }
                totalBytesRead++;
                return fileReader.read();
            }
            
            @Override
            public int read(byte[] buffer, int offset, int length) throws IOException{
                if(totalBytesRead >= rangeLength){
                    fileReader.close();
                    return -1;
                }
                long remainingBytes = rangeLength - totalBytesRead;
                int bytesToRead = (int) Math.min(length, remainingBytes);
                int bytesActuallyRead = fileReader.read(buffer,offset, bytesToRead);
                if(bytesActuallyRead > 0){
                    totalBytesRead += bytesActuallyRead;
                }
                if(totalBytesRead >= rangeLength){
                    fileReader.close();
                }
                return bytesActuallyRead;
            }

            @Override
            public void close() throws IOException {
                fileReader.close();
            }
        };

        return new InputStreamResource(partialContentStream){
            @Override
            public long contentLength() {
                return rangeLength;
            }
        };
    }
      public static Resource createFullResource(Path filePath) throws IOException{
            Resource resource = new UrlResource(filePath.toUri());
            if(!resource.exists() || !resource.isReadable()){
                throw new IOException("File not found or not readable: "+filePath);
            }
            return resource;
        }
}
