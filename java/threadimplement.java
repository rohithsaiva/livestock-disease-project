class thread2 implements Runnable{
public void run(int r){
for(int y=0;y<100;y++){
System.out.println(y);
try{
Thread.sleep(2000);
}
catch(Exception e){
System.out.println(e);
}}}
public static void main(String args[]){
thread2 T= new thread2();
TH.start();
}}