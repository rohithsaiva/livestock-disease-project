import javax.swing.*;
import java.awt.event.*;

public class MCQ {
    public static void main(String[] args) {

        JFrame f = new JFrame("Addition");

        JTextField t1 = new JTextField();
        JTextField t2 = new JTextField();
        JTextField t3 = new JTextField();

        JButton b = new JButton("Add");

        // Positions
        t1.setBounds(50,50,100,30);
        t2.setBounds(50,100,100,30);
        t3.setBounds(50,150,100,30);
        b.setBounds(50,200,100,30);

        // Add components
        f.add(t1); f.add(t2); f.add(t3); f.add(b);

        // Button action
        b.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                int a = Integer.parseInt(t1.getText());
                int b1 = Integer.parseInt(t2.getText());
                int sum = a + b1;
                t3.setText(String.valueOf(sum));
            }
        });

        f.setSize(300,300);
        f.setLayout(null);
        f.setVisible(true);
    }
}