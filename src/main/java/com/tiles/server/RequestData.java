package com.tiles.server;

public class RequestData {
    private String name;
    private String gold;
    private String silver;
    private String bronze;

    //constructor
    public RequestData(String newName, String newGold, String newSilver, String newBronze) {
        this.name = newName;
        this.gold = newGold;
        this.silver = newSilver;
        this.bronze = newBronze;
    }

    // Getters and setters (required by most JSON mapping libraries like Jackson)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGold() { return gold; }
    public void setGold(String gold) { this.gold = gold; }
    public String getSilver() { return silver; }
    public void setSilver(String silver) { this.silver = silver; }
    public String getBronze() { return bronze; }
    public void setBronze(String bronze) { this.bronze = bronze; }
}
