package eh.projects.energy.Entitys;

import jakarta.persistence.*;

import java.util.Collection;

@Entity
@Table(name = "usuario", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "nombre_usuario")
    private String nombre;
    private String password;
    private String email;

    private boolean estado;

    public boolean isEstado() {
        return estado;
    }

    public void setEstado(boolean estado) {
        this.estado = estado;
    }
    @ManyToMany(fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinTable(
            name = "usuario_roles",
            joinColumns = @JoinColumn(name = "usuario_id",referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id",referencedColumnName = "id")
    )
    private Collection<Rol> roles;


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


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Collection<Rol> getRoles() {
        return roles;
    }

    public void setRoles(Collection<Rol> roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Usuario(Long id, String nombre, String password, String email, boolean estado, Collection<Rol> roles) {
        this.id = id;
        this.nombre = nombre;
        this.password = password;
        this.email = email;
        this.estado = estado;
        this.roles = roles;
    }


    public Usuario(String nombre, String password, String email, boolean estado, Collection<Rol> roles) {
        this.nombre = nombre;
        this.password = password;
        this.email = email;
        this.estado = estado;
        this.roles = roles;
    }

    public Usuario() {
        super();
    }
}
