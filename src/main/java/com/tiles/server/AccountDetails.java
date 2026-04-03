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
        this.map.put("john", "john:b96482290a873ee9875236c0b4455988a10a7ec28bba60419d449429d0ced0e0\r\n" + //
                        "");
        return this.map;
    }

}
