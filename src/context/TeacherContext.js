"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const TeacherContext = createContext();

export function TeacherProvider({ children, profile }) {
    const [teacherProfile, setTeacherProfile] = useState(profile);

    const isCurriculumAdmin = teacherProfile?.isCurriculumAdmin || false;
    const assignments = teacherProfile?.assignments || [];

    return (
        <TeacherContext.Provider value={{
            teacherProfile,
            setTeacherProfile,
            isCurriculumAdmin,
            assignments
        }}>
            {children}
        </TeacherContext.Provider>
    );
}

export function useTeacher() {
    return useContext(TeacherContext);
}
