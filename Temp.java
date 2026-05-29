import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class Temp {
  public static void main(String[] args) throws Exception {
    String[] words = {"password","Password1","123456","12345678","qwerty","abc123","welcome","letmein","admin","test","guest","root","secret","login","user","passw0rd","P@ssw0rd","password123","qwerty123","iloveyou","1234","111111","000000","sunshine","monkey","football","welcome123","hello","world","john","ap","Frankie","SENDHELP"};
    String target = "c9765b38a8ded4d7f4286cbab7c104e95208a911b189beaf3c88182376e6bf32";
    for (String w : words) {
      String candidate = "john;" + w;
      String h = sha256(candidate);
      if (h.equals(target)) {
        System.out.println("FOUND password=" + w);
        return;
      }
    }
    System.out.println("No common-word match found for john;");
  }
  static String sha256(String s) throws Exception {
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    byte[] hash = digest.digest(s.getBytes(StandardCharsets.UTF_8));
    StringBuilder hex = new StringBuilder();
    for (byte b : hash) hex.append(String.format("%02x", b));
    return hex.toString();
  }
}
