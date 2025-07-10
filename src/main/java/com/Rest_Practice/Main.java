package com.Rest_Practice;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {
        Student student = new Student();
        student.setRollno(5);
        student.setSname("Beena Tripathi");
        student.setAge(4);

        Configuration cfg = new Configuration();
        cfg.addAnnotatedClass(Student.class);
        SessionFactory sf =cfg.configure().buildSessionFactory() ;
        Session session = sf.openSession();
        Transaction tx = session.beginTransaction();
        session.persist(student);
        tx.commit();
        session.close();
        System.out.println(student);
    }
}