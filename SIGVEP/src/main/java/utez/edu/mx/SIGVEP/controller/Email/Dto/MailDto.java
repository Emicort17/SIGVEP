package utez.edu.mx.SIGVEP.controller.Email.Dto;

public class MailDto {
    private String toEmail;


    public MailDto(String toEmail) {
        this.toEmail = toEmail;
    }

    public MailDto() {

    }

    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }
}
