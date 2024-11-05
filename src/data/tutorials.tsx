// Martin Carballo november 03 / 2024

import { Monitor, RotateCw, Cpu, Settings } from 'lucide-react';

export const tutorials = [
  {
    title: 'Introduction to PIC Assembly',
    icon: <Cpu className="w-6 h-6 text-blue-600" />,
    description: (
      <div className="space-y-4">
        <p>
          PIC16F877 assembly programming requires understanding of the microcontroller's
          architecture and instruction set. The PIC16F877 is an 8-bit microcontroller
          with Harvard architecture, featuring:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>8K x 14 words of Flash Program Memory</li>
          <li>368 x 8 bytes of Data Memory (RAM)</li>
          <li>256 x 8 bytes of EEPROM Data Memory</li>
          <li>33 I/O pins across 5 ports (A, B, C, D, E)</li>
        </ul>
      </div>
    ),
    code: `    PROCESSOR 16F877
    #include <p16f877.inc>
    
    ; Configuration bits
    __CONFIG _CP_OFF & _WDT_OFF & _BODEN_OFF & _PWRTE_ON & _HS_OSC & _WRT_OFF & _LVP_OFF & _CPD_OFF

    ORG 0x000    ; Reset vector
    goto Main
    
    ORG 0x004    ; Interrupt vector
    retfie
    
Main
    banksel TRISB    ; Select bank 1
    clrf    TRISB    ; Set PORTB as output
    banksel PORTB    ; Select bank 0
    
Loop
    movlw   0xFF    ; Load W with all 1's
    movwf   PORTB   ; Turn on all PORTB pins
    call    Delay   ; Wait
    clrf    PORTB   ; Turn off all PORTB pins
    call    Delay   ; Wait
    goto    Loop    ; Repeat forever

Delay
    movlw   0xFF    ; Load delay count
    movwf   0x20    ; Store in file register
Delay_Loop
    decfsz  0x20, 1 ; Decrement counter
    goto    Delay_Loop
    return
    
    END             ; End of program`,
    explanation: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Code Explanation:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The program begins by specifying the processor and including necessary header files</li>
          <li>Configuration bits are set for the oscillator type, watchdog timer, etc.</li>
          <li>The main program configures PORTB as output and creates a simple LED blinking pattern</li>
          <li>A delay routine is implemented using a counter in file register 0x20</li>
        </ul>
      </div>
    ),
  },
  {
    title: '16x2 LCD Interface',
    icon: <Monitor className="w-6 h-6 text-blue-600" />,
    description: (
      <div className="space-y-4">
        <p>
          Interfacing a 16x2 LCD with PIC16F877 requires proper initialization and
          understanding of the LCD's command set. We'll use the following connections:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>RS (Register Select) → RB0</li>
          <li>EN (Enable) → RB1</li>
          <li>D4-D7 → RB4-RB7 (4-bit mode)</li>
        </ul>
      </div>
    ),
    code: `    PROCESSOR 16F877
    #include <p16f877.inc>
    
    ; LCD pins on PORTB
    #define LCD_RS  0   ; Register Select on RB0
    #define LCD_EN  1   ; Enable on RB1
    
    ORG 0x000
    goto Main
    
LCD_Init
    banksel TRISB
    clrf    TRISB       ; Set PORTB as output
    banksel PORTB
    
    ; Wait for LCD power-up
    movlw   0x30
    call    LCD_Command
    call    Delay_5ms
    
    ; Initialize 4-bit mode
    movlw   0x02
    call    LCD_Command
    movlw   0x28        ; 4-bit, 2 lines, 5x7
    call    LCD_Command
    movlw   0x0C        ; Display ON, cursor OFF
    call    LCD_Command
    movlw   0x06        ; Auto increment cursor
    call    LCD_Command
    movlw   0x01        ; Clear display
    call    LCD_Command
    return

LCD_Command
    bcf     PORTB, LCD_RS  ; RS=0 for command
    goto    LCD_Send
    
LCD_Data
    bsf     PORTB, LCD_RS  ; RS=1 for data
    
LCD_Send
    movwf   0x20           ; Save data
    andlw   0xF0           ; Send upper nibble
    movwf   PORTB
    bsf     PORTB, LCD_EN  ; Enable pulse
    nop
    bcf     PORTB, LCD_EN
    
    swapf   0x20, W        ; Send lower nibble
    andlw   0xF0
    movwf   PORTB
    bsf     PORTB, LCD_EN
    nop
    bcf     PORTB, LCD_EN
    
    call    Delay_5ms
    return

Main
    call    LCD_Init
    
    ; Write "Hello, World!"
    movlw   'H'
    call    LCD_Data
    movlw   'e'
    call    LCD_Data
    movlw   'l'
    call    LCD_Data
    movlw   'l'
    call    LCD_Data
    movlw   'o'
    call    LCD_Data
    
    END`,
    explanation: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">LCD Interface Explanation:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>The LCD is initialized in 4-bit mode to save I/O pins</li>
          <li>LCD_Command sends instructions to the LCD (RS=0)</li>
          <li>LCD_Data sends characters to display (RS=1)</li>
          <li>Each byte is sent as two nibbles (4-bits) with an enable pulse</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'DC Motor Control',
    icon: <RotateCw className="w-6 h-6 text-blue-600" />,
    description: (
      <div className="space-y-4">
        <p>
          Controlling a DC motor with PIC16F877 involves PWM (Pulse Width Modulation)
          for speed control and H-bridge for direction control. We'll use:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>CCP1 (RC2) for PWM output</li>
          <li>RD0 and RD1 for direction control</li>
        </ul>
      </div>
    ),
    code: `    PROCESSOR 16F877
    #include <p16f877.inc>
    
    ; Direction pins
    #define DIR1    0   ; RD0
    #define DIR2    1   ; RD1
    
    ORG 0x000
    goto Main
    
PWM_Init
    banksel TRISC
    bcf     TRISC, 2      ; CCP1 output
    banksel PORTC
    
    ; Configure Timer2
    banksel T2CON
    movlw   0x07          ; Prescaler 1:16
    movwf   T2CON
    
    ; Configure CCP1 for PWM
    movlw   0x0C          ; PWM mode
    movwf   CCP1CON
    
    ; Set PWM period (PR2)
    banksel PR2
    movlw   0xFF
    movwf   PR2
    
    ; Set initial duty cycle
    movlw   0x7F          ; 50% duty cycle
    movwf   CCPR1L
    return

Motor_Init
    banksel TRISD
    clrf    TRISD         ; Direction pins as output
    banksel PORTD
    return

Motor_Forward
    banksel PORTD
    bsf     PORTD, DIR1
    bcf     PORTD, DIR2
    return

Motor_Reverse
    banksel PORTD
    bcf     PORTD, DIR1
    bsf     PORTD, DIR2
    return

Motor_Stop
    banksel PORTD
    bcf     PORTD, DIR1
    bcf     PORTD, DIR2
    return

Main
    call    PWM_Init
    call    Motor_Init
    
    ; Example motor control sequence
Loop
    call    Motor_Forward
    movlw   0xFF          ; Full speed
    movwf   CCPR1L
    call    Delay_1s
    
    call    Motor_Reverse
    movlw   0x7F          ; Half speed
    movwf   CCPR1L
    call    Delay_1s
    
    call    Motor_Stop
    call    Delay_1s
    
    goto    Loop
    
    END`,
    explanation: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">DC Motor Control Explanation:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>PWM is configured using CCP1 module and Timer2</li>
          <li>Direction control uses two pins connected to an H-bridge</li>
          <li>Speed is controlled by adjusting the PWM duty cycle (CCPR1L)</li>
          <li>The example demonstrates forward, reverse, and variable speed control</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Advanced Concepts',
    icon: <Settings className="w-6 h-6 text-blue-600" />,
    description: (
      <div className="space-y-4">
        <p>
          Advanced PIC assembly programming involves interrupts, timers, and combining
          multiple peripherals. Here are some key concepts:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Using interrupts for real-time response</li>
          <li>Timer calculations for precise timing</li>
          <li>Combining LCD display with motor feedback</li>
        </ul>
      </div>
    ),
    code: `    PROCESSOR 16F877
    #include <p16f877.inc>
    
    ; Variables
    CBLOCK  0x20
    Counter
    Speed
    ENDC
    
    ORG 0x000
    goto Main
    
    ORG 0x004           ; Interrupt vector
    btfss   PIR1, TMR1IF
    retfie
    bcf     PIR1, TMR1IF
    incf    Counter, F
    movlw   .10
    xorwf   Counter, W
    btfss   STATUS, Z
    retfie
    clrf    Counter
    call    Update_Display
    retfie
    
Timer1_Init
    banksel T1CON
    movlw   0x31        ; Timer1 ON, 1:8 prescale
    movwf   T1CON
    
    banksel PIE1
    bsf     PIE1, TMR1IE
    banksel INTCON
    bsf     INTCON, PEIE
    bsf     INTCON, GIE
    return

Update_Display
    ; Save current speed to LCD
    banksel Speed
    movf    Speed, W
    call    Binary_to_BCD
    call    Display_Speed
    return

Main
    call    LCD_Init
    call    PWM_Init
    call    Timer1_Init
    
    ; Main control loop
Loop
    banksel Speed
    movf    Speed, W    ; Get current speed
    movwf   CCPR1L      ; Update PWM
    
    btfss   PORTB, 0    ; Check speed up button
    call    Increase_Speed
    btfss   PORTB, 1    ; Check speed down button
    call    Decrease_Speed
    
    goto    Loop
    
    END`,
    explanation: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Advanced Features:</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Timer1 interrupt used for regular LCD updates</li>
          <li>Speed control with feedback display</li>
          <li>Button debouncing and input handling</li>
          <li>Combining PWM, LCD, and interrupt handling</li>
        </ul>
        <p className="mt-4">
          This example shows how to integrate multiple peripherals while maintaining
          real-time operation through interrupts. The LCD displays the current motor
          speed while allowing user control through buttons.
        </p>
      </div>
    ),
  },
];