class thread1 extends Thread
{
public void run()
{
System.out.println("tread is running");
}
public static void main(String args[])
{
thread1 T= new thread1();
T.start();
T.run();
}
}