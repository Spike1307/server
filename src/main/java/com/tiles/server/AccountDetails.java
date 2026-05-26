package com.tiles.server;

import java.io.BufferedReader;
//import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.InputStreamReader;

@Component
public class AccountDetails {
    
    //HashMap to store username and password pairs, where the key is the username and the value is the password
    private final HashMap<String, String> map = new HashMap<>(); 

    public AccountDetails() {
        try {
            //loads the file from the classpath
            ClassPathResource resource = new ClassPathResource("AccountDetails.txt"); 
            //reads the file using BufferedReader
            try (BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream()))) { 
                String line;
                //reads the file line by line until the end of the file is reached
                while ((line = br.readLine()) != null) {    
                    System.out.println("Account details:");
                    System.out.println(line);
                    //splits the line into two parts using ":" as the delimiter, where parts[0] is the username and parts[1] is the password
                    String[] parts = line.split(":"); 
                    if (parts.length == 2) {
                        //splits the line into username and password and stores in map
                        map.put(parts[0].trim(), parts[1].trim());  
                        System.out.println("Acc: " +parts[0]);
                        System.out.println("PW: " + parts[1]);
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    public HashMap<String, String> getMap() {
        //returns the map containing username and password pairs
        return map; 
    }

}
