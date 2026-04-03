package com.tiles.server;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

public class AccountDetails {
    
    HashMap<String, String> map;

    AccountDetails(String filePath) {

        map = new HashMap<>();
        
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
            //load into a hash map
                System.out.println(line);
                map.put(line.split(":")[0], line.split(":")[1]);
            }   
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
    
    HashMap<String, String> getMap() {
        //harcoded credentials for testing because file read won't work
        this.map.put("john", "c9765b38a8ded4d7f4286cbab7c104e95208a911b189beaf3c88182376e6bf32");
        return this.map;
    }

}
