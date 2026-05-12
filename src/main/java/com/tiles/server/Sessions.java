package com.tiles.server;

import java.util.HashMap;

public class Sessions {
    private HashMap<String, PlayerData> tokens;

    public Sessions() {
        tokens = new HashMap<>();
    }

    public void addSession(String token, String name) {
        tokens.put(token, new PlayerData(name));
    }

    public PlayerData logOut(String token) {
        return tokens.remove(token);
    }

    public void list() {
        System.out.println(tokens);
    }

    //Required for tests - DS: overkill, deprecated in favour of isValid
    /* 
    public String getUserName(String token) {
        return tokens.get(token);
    }
    */
    
    public boolean isValid(String token) {
        return tokens.containsKey(token);
    }

    public PlayerData getPlayer(String token) {
        return tokens.get(token);
    }

}
