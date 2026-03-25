package com.tiles.server;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "*")
public class MyController {

    @PostMapping("/test")
    public ResponseEntity<RequestData> handleJsonRequest(@RequestBody RequestData requestData) {
        // Access the data directly from the Java object
        System.out.println("Received name: " + requestData.getName());
        System.out.println("Received gold: " + requestData.getGold());
        System.out.println("Received silver: " + requestData.getSilver());
        System.out.println("Received bronze: " + requestData.getBronze());

        // Return a response, e.g., an OK status
        // return new ResponseEntity<>("Data received successfully", HttpStatus.OK);
        return new ResponseEntity<>(requestData, HttpStatus.OK);
    }
}
