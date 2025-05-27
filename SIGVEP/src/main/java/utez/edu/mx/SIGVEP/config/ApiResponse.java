package utez.edu.mx.SIGVEP.config;

import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;


@NoArgsConstructor
public class ApiResponse {

    private Object data;
    private HttpStatus status;
    private boolean error;
    private String message;

    public ApiResponse(Object data, HttpStatus status) {
        this.data = data;
        this.status = status;
    }

    public ApiResponse(HttpStatus status, boolean error, String message){
        this.status = status;
        this.error = error;
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public boolean isError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public void setError(boolean error) {
        this.error = error;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
