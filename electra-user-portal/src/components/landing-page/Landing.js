'use client'
import React from 'react'
import LightninigBold from '../3d-models/lightning-bolt'
import { Environment} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import styles from '../../app/styles/Landing.module.css'
import {motion} from 'framer-motion'
import ReactTypingEffect from 'react-typing-effect'
const Landing = () => {
  return (
    <>
       <div className={`flex items-center`}>
      <div className="w-1/2 flex flex-col p-4 gap-3 ">
      <motion.div className="border-l-4 border-yellow-300 " initial={{
        x:-1000,
      }}
      animate={{
        x:0,
        transition:{
          type:"spring",
          stiffness:100,
          duration:1,
        }
      }}
      >
      <span className='font-bold text-2xl lg:text-5xl sm:text-lg text-blue-200 '>Electra Society:</span>
      <ReactTypingEffect eraseSpeed={120} eraseDelay={1} speed={120}
        text={["Powering Innovation & Excellence"]}
        cursorRenderer={cursor => <h1 className='font-extralight text-2xl lg:text-5xl sm:text-xl'>{cursor}</h1>}
        displayTextRenderer={(text, i) => {
          return (
            <span className='font-bold text-2xl lg:text-5xl sm:text-lg text-rose-200'>
              {text.split('').map((char, i) => {
                const key = `${i}`;
                return (
                  <span
                    key={key}
                    style={i%2 === 0 ? { color: ''} : {}}
                  >{char}</span>
                );
              })}
            </span>
          );
        }}        
      />
      </motion.div>
      <motion.div className="text-lg lg:text-2xl sm:text-base font-serif" initial={{
        x:-1000,
      }}
      animate={{
        x:0,
        transition:{
          type:"spring",
          stiffness:50,
          duration:1,
          delay:1,
        }
      }}>The Official Society of the Electrical Engineering Department, NIT Silchar</motion.div>
      </div>
      <motion.div initial={{y:-100}} animate={{
        y:0,
        transition:{
          type:"spring",
          stiffness:800,
          damping:3,
          duration:1,
        }
      }}>
      <Canvas style={{width:'50vw',height:'80vh'}} shadows>
      <LightninigBold />
      <Environment preset="park"/>
      </Canvas>
      </motion.div>
      </div>
    </>
  )
}

export default Landing
