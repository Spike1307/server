package com.tiles.server;

import java.security.SecureRandom;
import java.util.Base64;

public class LoginData {
    private String name;
    private String password;

    private static final SecureRandom Token = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder();
    
    //Constructor
    public LoginData(String n, String p) {
        this.name = n;
        this.password = p;
    }

    public String getName() {
        return this.name;
    }

    public String getPass() {
        return this.password;
    }

    public String generateToken() {
        byte[] randomBytes = new byte[24];
        Token.nextBytes(randomBytes);
        String token = base64Encoder.encodeToString(randomBytes);
        return  "{\"session\": " + "\"" + token + "\"}";
    }
}
