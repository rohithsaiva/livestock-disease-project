import calculator.calculation;
import squared.mypac2;

class maindemo {
    public static void main(String args[]) {

        int a = 100, b = 200;
        calculation c = new calculation();
        mypac2 p= new mypac2();

        System.out.println(
            c.add(a, b) + "\t" +
            c.sub(a, b) + "\t" +
            c.multi(a, b) + "\t" + p.squar(a,b)
        );
    }
}
