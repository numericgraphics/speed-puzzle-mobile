import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import RegistrationModal from "@/components/modals/register";
import { router } from "expo-router";

export default function DebugUI() {
  const { styles } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [simulateType, setSimulateType] = useState<"normal" | "error" | "success">("normal");
  const [modalState, setModalState] = useState<{
    submitError: string | null;
    isSuccess: boolean;
  }>({ submitError: null, isSuccess: false });

  const openModal = (type: "normal" | "error" | "success") => {
    setSimulateType(type);
    setModalState({ submitError: null, isSuccess: false });
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (values: any) => {
    console.log("Debug: Submit", values);
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (simulateType === "error") {
      setModalState({ 
        submitError: "Debug: This is a simulated error message.", 
        isSuccess: false 
      });
    } else if (simulateType === "success" || simulateType === "normal") {
      setModalState({ 
        submitError: null, 
        isSuccess: true 
      });
    }
  };

  const Button = ({ title, onPress, color }: any) => (
    <TouchableOpacity 
      onPress={onPress} 
      style={{ 
        backgroundColor: color || "#007AFF", 
        padding: 15, 
        borderRadius: 8, 
        marginBottom: 10,
        alignItems: "center"
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.containers.centeredFullScreen, { justifyContent: 'flex-start', paddingTop: 20 }]}>
      <ScrollView contentContainerStyle={{ padding: 20, width: "100%" }}>
        <Text style={[styles.typography.title, { marginBottom: 20, textAlign: "center" }]}>
          Debug UI
        </Text>
        
        <View style={{ width: "100%", maxWidth: 400, alignSelf: "center" }}>
          <Button 
            title="Test Registration (Normal Flow)" 
            onPress={() => openModal("normal")} 
          />
          <Button 
            title="Test Registration (Force Error)" 
            onPress={() => openModal("error")} 
            color="#FF3B30"
          />
           <Button 
            title="Test Registration (Immediate Success)" 
            onPress={() => {
                setSimulateType("success");
                setModalState({ submitError: null, isSuccess: true });
                setModalVisible(true);
            }} 
            color="#34C759"
          />

          <View style={{ height: 40 }} />
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            color="#8E8E93"
          />
        </View>

        <RegistrationModal
          visible={modalVisible}
          onClose={handleClose}
          onSubmit={handleSubmit}
          submitError={modalState.submitError}
          isSuccess={modalState.isSuccess}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
