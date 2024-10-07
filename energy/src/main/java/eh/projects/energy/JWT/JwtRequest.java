package eh.projects.energy.JWT;

public class JwtRequest {
    private String username;
    private String password;

    // Constructor vacío necesario para la deserialización de JSON
    public JwtRequest() {
    }

    // Constructor con parámetros
    public JwtRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
