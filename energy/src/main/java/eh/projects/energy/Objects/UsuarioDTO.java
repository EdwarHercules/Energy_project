package eh.projects.energy.Objects;

import java.util.List;

public class UsuarioDTO {

    private Long id;
    private String nombre;
    private String email;
    private boolean estado;
    private List<String> roles;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public UsuarioDTO(Long id, String nombre, String email, boolean estado, List<String> roles) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.estado = estado;
        this.roles = roles;
    }

    public UsuarioDTO() {
    }
}
